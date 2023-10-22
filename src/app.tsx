import { Layout } from "@/components/layout";
import Board from "@/components/board";
import { Input } from "@/components/ui/input";

function App() {
  const title = "Cегодняшние заказы";

  return (
    <Layout title={title}>
      <Input
        className="text-sm text-muted-foreground max-w-[240px]"
        placeholder="Поиск по ID"
      />
      <Board />
    </Layout>
  );
}

export default App;
