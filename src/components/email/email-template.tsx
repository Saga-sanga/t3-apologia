interface EmailTemplateProps {
  url: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  url,
}) => (
  <div>
    <h1>Welcome!</h1>
    <p>Click the link below to sign in</p>
    <a href={url}>{url}</a>
  </div>
);
