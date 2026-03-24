import { UserButton } from "@clerk/clerk-react";

const ClerkLogout = () => {
  return (
    <div>
      <h2>BuildTrack</h2>

      {/* Clerk handles logout automatically */}
      <UserButton />
    </div>
  );
};

export default ClerkLogout;


//++++THIS IS USED TO FETCH THE USER DETAIL ANYWHERE USE CONTEXT API++++
//import { useUser } from "@clerk/clerk-react";

//const { user } = useUser();

//console.log(user.id);
//console.log(user.fullName);