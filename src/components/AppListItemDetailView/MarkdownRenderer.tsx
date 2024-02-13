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

const chain = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype, {
    handlers: {
      link: (state, node) => {
        let url = new URL(node.url, location.origin);

        if (url.origin === "https://banglejs.com") {
          if ((url.pathname === "/apps" || url.pathname === "/apps/") && url.searchParams.has('id')) {
            url = new URL(`/#/apps/${url.searchParams.get('id')}`, location.origin + import.meta.env.BASE_URL);
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
