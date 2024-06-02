// "use client"

// import { ColumnDef } from "@tanstack/react-table"

import PropTypes from "prop-types";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export const Tune = {
  id: PropTypes.string,
  image: PropTypes.string,
  index: PropTypes.number,
  name: PropTypes.string,
  album: PropTypes.string,
  added_at: PropTypes.string,
  time: PropTypes.string,
  status: PropTypes.oneOf(["pending", "processing", "success", "failed"]),
};

export const columns = [
  {
    accessorKey: "index",
    header: "#",
  },
  {
    accessorKey: "image",
    header: "",
    cell: ({ value }) => {
      console.log(value);
      return (
        <img
          src={value}
          alt="Album cover"
          style={{ width: "40px", height: "40px" }}
        />
      );
    },
  },
  {
    accessorKey: "name",
    header: "タイトル",
  },
  {
    accessorKey: "album",
    header: "アルバム",
  },
  {
    accessorKey: "added_at",
    header: "追加日",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "time",
    header: "time",
  },
];
