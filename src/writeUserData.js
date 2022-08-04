import { getDatabase, ref, set } from "firebase/database";

function writeUserData(userId, email) {
  const db = getDatabase();
  set(ref(db, 'users/' + userId), {
    email: email,
  });
}

export default writeUserData;