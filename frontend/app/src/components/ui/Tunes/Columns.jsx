// "use client"

// import { ColumnDef } from "@tanstack/react-table"

import PropTypes from "prop-types";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export const Tune = {
  id: PropTypes.string,
  amount: PropTypes.number,
  status: PropTypes.oneOf(["pending", "processing", "success", "failed"]),
  email: PropTypes.string,
};

export const columns = [
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
];
