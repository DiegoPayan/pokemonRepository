import { List, ListItem } from "@material-ui/core";

const Lista = (data) => {
  return (
    <List>
      {data.data.map((item) => (
        <ListItem key={`${item}`}>{item}</ListItem>
      ))}
    </List>
  );
};

export default Lista;
