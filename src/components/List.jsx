import Item from "./Item";
function List({list}){
  return( 
    <ul>
      {list.map(function(item){
        return <Item key={item.objectID} item={item}/>
      })}
    </ul>
  );
}
export default List;
