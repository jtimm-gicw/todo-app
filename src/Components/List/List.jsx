import { useContext, useState } from 'react';
import { SettingsContext } from '../../Context/Settings/Settings';
import { When } from 'react-if';
import { Badge, Card, CloseButton, Group, Pagination, Text, createStyles } from '@mantine/core';

const useStyles = createStyles((theme) => ({
  badge: {
    textTransform: 'capitalize',
    fontSize: theme.fontSizes.xs,
    margin: '3px',
  },
}));

const List = ({ list, toggleComplete, deleteItem }) => {
  const { classes } = useStyles();

 
  // Access user-configurable settings for number of items per page and showing completed items
  const { pageItems, showCompleted } = useContext(SettingsContext); 
  // - pageItems: how many items to show per page (user-configurable)
  // - showCompleted: whether to show completed tasks or hide them (user-configurable)

  const [page, setPage] = useState(1);

  // ----- Filter list based on showCompleted setting -----
  // If showCompleted is true → show all tasks
  // If showCompleted is false → only show tasks that are not completed
  const renderList = showCompleted ? list : list.filter(item => !item.complete);

  // ----- Pagination Logic -----
  const listStart = pageItems * (page - 1);
  const listEnd = listStart + pageItems;
  const pageCount = Math.ceil(renderList.length / pageItems);
  const displayList = renderList ? renderList.slice(listStart, listEnd) : [];

  // ----- Render UI -----
  return (
    <>
      {displayList.map(item => (
        <Card key={item.id} withBorder shadow="md" radius="sm" pb="xs" mb="sm">
          <Card.Section withBorder>
            <Group position="apart">
              <Group position="left">
                <Badge
                  color={item.complete ? "red" : "green"}
                  variant="filled"
                  className={classes.badge}
                  onClick={() => toggleComplete(item.id)}
                >
                  {item.complete ? 'Complete' : 'Pending'}
                </Badge>
                <Text>{item.assignee}</Text>
              </Group>
              <Group>
                <CloseButton title="Close ToDo Item" onClick={() => deleteItem(item.id)} />
              </Group>
            </Group>
          </Card.Section>

          <Text align="left" mt="sm">{item.text}</Text>
          <Text align="right"><small>Difficulty: {item.difficulty}</small></Text>
        </Card>
      ))}

      {/* Show pagination controls if there are items */}
      <When condition={renderList.length > 0}>
        <Pagination page={page} onChange={setPage} total={pageCount} />
      </When>
    </>
  )
}

export default List;
