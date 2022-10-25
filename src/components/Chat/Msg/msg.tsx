export default function Msg(props: any) {
  const msg_items = props.items.map((item: any, index: any) => {
    return (
      <div key={index}>
        <div className={item.info}>
          {item.info === "infoB"
            ? item.time + "\u00A0\u00A0" + item.name_forAvatar
            : item.name_forAvatar + "\u00A0\u00A0" + item.time}
        </div>
        <div className={item.talk}>
          <div
            className={item.avatar}
            dangerouslySetInnerHTML={{ __html: item.svgCode }}
          ></div>
          <span>{item.message}</span>
        </div>
      </div>
    );
  });
  return <>{msg_items}</>;
}
