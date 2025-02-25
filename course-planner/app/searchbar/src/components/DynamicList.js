//Display elements in box
const DynamicList = () =>
{
    const elements = ["Component", "component2", "Comper3"];

    return(
        <div>
            {elements.map((element, i) => {
                return <div>{element}</div>
            })}
        </div>
    );
}
//{elements.map((element, i) => React.createElement(element, {Key:i}))}
export default DynamicList;