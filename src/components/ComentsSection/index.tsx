import { useEffect } from 'react';

export function CommentsSection() {
  useEffect(() => {
    const script = document.createElement('script');
    const anchor = document.getElementById('inject-comments-for-uterances');
    script.setAttribute('src', 'https://utteranc.es/client.js');
    script.setAttribute('crossorigin', 'anonymous');
    script.setAttribute('async', true);
    script.setAttribute(
      'repo',
      'pedropaulodf/ignite-chapter3-react-desafio-principal'
    );
    script.setAttribute('issue-term', 'url');
    script.setAttribute('theme', 'github-dark');
    anchor.appendChild(script);
  }, []);

  return <div id="inject-comments-for-uterances" />;
}