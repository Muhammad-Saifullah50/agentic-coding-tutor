'use client';
import type { BundledLanguage } from '@/components/ui/shadcn-io/code-block';
import {
    CodeBlock,
    CodeBlockBody,
    CodeBlockContent,
    CodeBlockItem,
} from '@/components/ui/shadcn-io/code-block';
import { detectLanguage } from '@/lib/detectLanguage';

const CodeBox = ({ codestr, language }: { codestr: string, language?: string }) => {
    const formattedCode = codestr.replace(/\\n/g, '\n');
    const detectedLanguage = language || detectLanguage(formattedCode);

    const code = [
        {
            language: detectedLanguage,
            filename: '',
            code: formattedCode
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