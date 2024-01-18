import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

export function PostCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Title of the card</CardTitle>
        <CardDescription>Description of the card</CardDescription>
        <CardContent className="rounded-md p-0">
          <img
            className="rounded-md"
            src="https://res.cloudinary.com/practicaldev/image/fetch/s--PEV2gWZF--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ivcklrrurjt31814zwio.png"
          />
        </CardContent>
      </CardHeader>
    </Card>
  );
}
