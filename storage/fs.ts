import {promises as fsp} from 'fs';

type ItemType = {
  id: string;
  title: string;
  complete: boolean;
}

const fileName = 'items.json';
const filePath = `${__dirname}/${fileName}`;

export const readItemList = async (): Promise<ItemType[]> => {
  let list: ItemType[] = [];

  try {
    const content = await fsp.readFile(filePath, 'utf-8');
    const parsedList = JSON.parse(content);

    if (!Array.isArray(parsedList)) {
      throw new Error();
    }

    list = parsedList;
  } catch (e: unknown) {
    if (!(e instanceof Error)) {
      throw e;
    }

    console.warn(`There was Error: ${e.message}`)
  }
  return list;
};

export const writeItemList = async (list: ItemType[]): Promise<ItemType[]> => {
  const stringifierList = JSON.stringify(list);

  await fsp.writeFile(filePath, stringifierList, 'utf-8');
  return list;
};

export const getListAll = async (): Promise<ItemType[]> => {
  return await readItemList();
};

export const getById = async (id: string): Promise<ItemType | undefined> => {
  const list = await readItemList();

  return list.find((item: ItemType) => {
    return item.id === id;
  })
};

export const create = async (item: ItemType): Promise<ItemType | undefined> => {
  const list: ItemType[] = await readItemList();
  list.push(item);

  await writeItemList(list);

  return item;
};

export const update = async (item: ItemType): Promise<ItemType> => {
  const list: ItemType[] = await readItemList();

  const index = list.findIndex(v => v.id === item.id);

  if (index === -1) {
    throw new Error();
  }
  list[index] = item;
  await writeItemList(list);

  return item;
};

export const remove = async (id: string): Promise<void> => {
  const list: ItemType[] = await readItemList();

  const index = list.findIndex(v => v.id === id);

  list.splice(index, 1);

  if (index === -1) {
    throw new Error();
  }

  await writeItemList(list);
};
