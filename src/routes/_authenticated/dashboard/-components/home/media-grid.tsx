export type MediaItem = {
  id: string
  kind: 'video' | 'image'
  title: string
  thumbnailUrl: string
}

export function MediaGrid({ items }: { items: MediaItem[] }) {
  return (
    <ul className="grid w-full grid-cols-2 gap-3 pt-6 md:grid-cols-4 xl:grid-cols-5">
      {items.map((item) => (
        <li key={item.id} className="space-y-2">
          <div className="aspect-3/4 overflow-hidden rounded-xl border border-border bg-card">
            <img
              src={item.thumbnailUrl}
              alt=""
              loading="lazy"
              className="size-full object-cover"
            />
          </div>
          <p className="truncate text-sm text-foreground">{item.title}</p>
        </li>
      ))}
    </ul>
  )
}
