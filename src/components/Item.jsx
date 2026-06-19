function Item({ item }) {
  return (
    <li key={item.id} className="pokemon-item">
      <img src={item.imagemUrl} alt={item.name}
        style={{ width: '96px', height: '96px', imageRendering:"pixelated" }} />
      <span>
        <a href={item.url}>{item.name}<br /></a>

      </span>

      <span>
        ID: {item.id}
      </span>
    <br/>
    </li >
  );

}

export default Item;