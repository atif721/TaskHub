import type { Route } from "./+types/home";
import { Button } from "@/components/ui/button";
export function meta({}: Route.MetaArgs) {
  return [{ title: "New React Router App" }, { name: "description", content: "Welcome to React Router!" }];
}

const HomePage = () => {
  return (
    <>
      <div>
        <Button>My button</Button>
        <h1>hello guys</h1>
      </div>
    </>
  );
};

export default HomePage;
