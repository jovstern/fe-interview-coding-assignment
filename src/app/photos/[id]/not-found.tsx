import Link from 'next/link';
import { ErrorState } from '../../ui/error-state';

export default function PhotoNotFound() {
  return (
    <ErrorState
      title="Photo not found"
      message="This photo may have been removed, or the link is mistyped."
      action={<Link href="/">Back to all photos</Link>}
    />
  );
}
