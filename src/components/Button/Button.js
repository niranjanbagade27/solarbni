'use client'
import { Button } from "reactstrap";

export default function ButtonComponent({ color, children }) {
  return <Button color={color || "primary"}>{children}</Button>;
}
