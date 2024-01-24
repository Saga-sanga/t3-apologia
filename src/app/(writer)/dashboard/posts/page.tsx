export default function PostsPage() {
  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Posts</h2>
          <p className="text-muted-foreground">
            Here&apos;s a list of all the posts created
          </p>
        </div>
      </div>
      {/* <DataTable columns={columns} data={data} /> */}
    </>
  );
}
