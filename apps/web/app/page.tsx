import { Button } from '@/components/ui';
import Link from 'next/link';

const HomePage = () => {
  return (
    <div className="h-screen w-screen flex items-center justify-center flex-col gap-5">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary">CSV Importer</h1>
        <p className="mt-4 text-lg text text-gray-400 ">Eldar and Jasmin</p>
      </div>

      <Button className="w-24">
        <Link href="/csv-import">Let's go!</Link>
      </Button>
    </div>
  );
};

export default HomePage;
