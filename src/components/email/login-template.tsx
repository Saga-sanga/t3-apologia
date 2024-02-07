interface EmailTemplateProps {
  url: string;
}

export const LoginTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  url,
}) => (
  <div>
    <h1>Welcome!</h1>
    <p>Click the link below to login</p>
    <a href={url}>{url}</a>
  </div>
);
