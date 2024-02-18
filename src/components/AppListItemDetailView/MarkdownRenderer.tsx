import { useEffect, useRef, useState } from 'react'
import rehypeStringify from 'rehype-stringify'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype, {  } from 'remark-rehype'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import {unified} from 'unified'
import rehypeShiftHeading from 'rehype-shift-heading'
import rehypeHighlight from 'rehype-highlight'
import "highlight.js/styles/a11y-dark.min.css";
import * as BangleJsUrls from '../../api/banglejs/urls'

const chain = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype, {
    handlers: {
      image: (state, node) => {
        const urlString = node.url;
        if (urlString.startsWith('/') || urlString.startsWith('http://') || urlString.startsWith('https://')) {
          const url = new URL(node.url, new URL(BangleJsUrls.RemoteBaseUrl).origin);
          return state.all({
            ...node,
            properties: {
              ...node.properties,
              src: url.href,
            },
          });
        }

        const appId = location.hash.startsWith('#/apps/') ? location.hash.split('/')[2] : '_';
        const url = new URL(node.url, BangleJsUrls.fromBaseUrl(`apps/${appId}/`));

        return {
          type: "element",
          tagName: "img",
          properties: {
            src: url.href,
            title: node.title,
            alt: node.alt || node.url,
          },
          children: state.all(node),
        };
      },
      link: (state, node) => {
        const url = new URL(node.url, location.origin);

        // Matching url like https://www.banglejs.com/apps
        if (
          (url.origin === new URL(BangleJsUrls.RemoteBaseUrl).origin) &&
          (url.pathname === "/apps" || url.pathname === "/apps/")
        ) {
          const appName = url.searchParams.get('id') || url.hash.substring(1);
          if (appName) {
            const newUrl = new URL(`${import.meta.env.BASE_URL}#/apps/${appName}`, location.origin);
            return {
              type: "element",
              tagName: "a",
              properties: {
                href: newUrl.href,
              },
              children: state.all(node),
            };
          }
        }

        return {
          type: "element",
          tagName: "a",
          properties: {
            target: "_blank",
            rel: "noopener",
            href: url.href,
          },
          children: state.all(node),
        };
      }
    }
  })
  .use(rehypeHighlight)
  .use(rehypeShiftHeading, { shift: 1 })
  .use(rehypeSanitize, {
    ...defaultSchema,
    attributes: {
      ...defaultSchema.attributes,
      a: [
        ...(defaultSchema.attributes?.a || []),
        ['target', '_blank'],
        ['rel', 'noopener'],
      ],
      span: [
        ...(defaultSchema.attributes?.span || []),
        // Allow all class names starting with `hljs-`.
        ['className', /^hljs-./]
        // Alternatively, to allow only certain class names:
        // ['className', 'hljs-number', 'hljs-title', 'hljs-variable']
      ]
    },
    tagNames: [...(defaultSchema.tagNames || []), 'span']
  })
  .use(rehypeStringify)
;

const useRemark = (doc: string) => {
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const requestSequence = useRef(1);
  useEffect(() => {
    setIsLoading(true);
    const seq = requestSequence.current;
    chain.process(doc)
      .then((file): void => {
        if (requestSequence.current !== seq) return;
        setOutput(file.toString())
      })
      .finally(() => {
        if (requestSequence.current !== seq) return;
        setIsLoading(false);
      })
    ;
    return () => {
      requestSequence.current += 1;
      setIsLoading(false);
    };
  }, [doc])

  return {
    isLoading,
    output,
  };
}

export const MarkdownRenderer = ({ input }: { input: string }) => {
  const { output, isLoading } = useRemark(input);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div dangerouslySetInnerHTML={{
      __html: output,
    }} />
  )
};
