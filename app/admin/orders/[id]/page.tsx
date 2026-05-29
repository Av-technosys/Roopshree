import Details from "./DetailsClient";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  const { id } = await params;

  return (
    <div>
      <Details id={id} />
    </div>
  );
};

export default Page;
