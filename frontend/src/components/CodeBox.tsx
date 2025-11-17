'use client';
import type { BundledLanguage } from '@/components/ui/shadcn-io/code-block';
import {
    CodeBlock,
    CodeBlockBody,
    CodeBlockContent,
    CodeBlockItem,
} from '@/components/ui/shadcn-io/code-block';
import { detectLanguage } from '@/lib/detectLanguage';

const CodeBox = ({ codestr }: { codestr: string }) => {
    const language = detectLanguage(codestr)

    const code = [
        {
            language: language,
            filename: '',
            code: codestr
        },
    ];
    return (
        <CodeBlock data={code} defaultValue={code[0].language}>
            <CodeBlockBody>
                {(item) => (
                    <CodeBlockItem key={item.language} value={item.language}>
                        <CodeBlockContent language={item.language as BundledLanguage}>
                            {item.code}
                        </CodeBlockContent>
                    </CodeBlockItem>
                )}
            </CodeBlockBody>
        </CodeBlock>
    )
};
export default CodeBox;