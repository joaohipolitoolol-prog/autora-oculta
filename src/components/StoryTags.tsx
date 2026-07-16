type Props = { tags: string[] }

export function StoryTags({ tags }: Props) {
  return (
    <ul className="flex flex-wrap gap-2" role="list">
      {tags.map((tag) => (
        <li
          key={tag}
          className="border border-white/10 bg-elevated px-3 py-1.5 font-display text-base text-ivory"
        >
          {tag}
        </li>
      ))}
    </ul>
  )
}
