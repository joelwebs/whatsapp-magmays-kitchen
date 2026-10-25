import './CategoryTabs.css'
export default function CategoryTabs({
  categories,
  activeId,
  onSelect,
  showAll = true,
}) {
  return (
    <div className="category-tabs" id="category-tabs">
      <div className="category-tabs__scroll">
        {showAll && (
          <button
            className={`category-tabs__tab ${!activeId ? 'category-tabs__tab--active' : ''}`}
            onClick={() => onSelect(null)}
            id="category-tab-all"
          >
            All
          </button>
        )}
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`category-tabs__tab ${activeId === cat.id ? 'category-tabs__tab--active' : ''}`}
            onClick={() => onSelect(cat.id)}
            id={`category-tab-${cat.id}`}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  )
}
