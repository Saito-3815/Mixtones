import { useState, useEffect } from "react";
import { columns } from "./Columns";
import { DataTable } from "./DataTable";

async function getData() {
  // Fetch data from your API here.
  return [
    {
      id: "1",
      index: 1,
      image: "https://picsum.photos/500",
      name: "Tune 1",
      album: "Album 1",
      added_at: "2021-01-01",
      status: "pending",
      time: "3:00",
    },
    {
      id: "2",
      index: 2,
      image: "https://picsum.photos/500",
      name: "Tune 2",
      album: "Album 2",
      added_at: "2021-01-02",
      status: "processing",
      time: "4:00",
    },
    {
      id: "3",
      index: 3,
      image: "https://picsum.photos/500",
      name: "Tune 3",
      album: "Album 3",
      added_at: "2021-01-03",
      status: "success",
      time: "5:00",
    },
    // ...
  ];
}

export default function DemoPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getData();
      setData(result);
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
