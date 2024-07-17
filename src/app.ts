import * as Etebase from "etebase";
import { Page, Group, Directory } from "./eb";

export async function login(
  username: string,
  password: string,
  endpoint: string
) {
  console.info("Logging into Etebase..");
  const etebase = await Etebase.Account.login(username, password, endpoint);
  console.info("Successfully connected!");

  const directory = await Directory.Create(etebase);
  await directory.populate();

  /*
  let page = new Page();
  page.meta.name = "Avril Lavigne";
  page.meta.description = "Amazing page on Avril Lavigne";
  page.content.article = "this is the content of the page";

  directory.uploadPage(page);]
  */
}
