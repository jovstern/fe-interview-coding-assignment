import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getHome, getPhoto } from '../../lib/api';
import { PhotoHero } from '../../ui/photo/photo-hero';
import { PhotoSheet } from '../../ui/photo/photo-sheet';
import { RelatedPhotos } from '../../ui/photo/related-photos';
import styles from './page.module.css';

export async function generateMetadata({
  params,
}: PageProps<'/photos/[id]'>): Promise<Metadata> {
  const { id } = await params;
  const photo = await getPhoto(id);
  if (!photo) notFound();

  return {
    title: photo.title,
    description: photo.description,
    openGraph: {
      images: [
        {
          url: photo.image.url,
          width: photo.image.width,
          height: photo.image.height,
        },
      ],
    },
  };
}

export default async function PhotoPage({
  params,
}: PageProps<'/photos/[id]'>) {
  const { id } = await params;
  // The feed names the related thumbnails; both requests start together.
  const [photo, home] = await Promise.all([getPhoto(id), getHome()]);
  if (!photo) notFound();

  return (
    <main id="main" className={styles.page}>
      <PhotoHero photo={photo} />
      {/* Keyed so a related photo, reached by client navigation, starts fresh. */}
      <PhotoSheet key={photo.id} photo={photo}>
        <RelatedPhotos related={photo.related} feed={home.items} />
      </PhotoSheet>
    </main>
  );
}
