export default function AdminProfilePage({ loggedInUser }) {
  return (
    <div>
      <h1>
        Admin Profile Page, {loggedInUser.fullName} - {loggedInUser.companyName}
      </h1>
    </div>
  );
}
