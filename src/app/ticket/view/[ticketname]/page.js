import TicketView from "@/components/TicketView/TicketView";
export default function TicketViewUI({ params: { ticketname } }) {
  return <TicketView ticketName={ticketname} />;
}
