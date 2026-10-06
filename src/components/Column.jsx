import Card from './Card'

function Column({ title, cards }) {
  return (
    <div className="column">
      <h2>{title}</h2>
      {cards.map((card) => (
        <Card key={card.id} title={card.title} />
      ))}
    </div>
  )
}

export default Column