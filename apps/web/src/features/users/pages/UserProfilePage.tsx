import { useParams } from 'react-router-dom';

export function UserProfilePage() {
  const { id } = useParams();

  return <div>{id}</div>;
}
