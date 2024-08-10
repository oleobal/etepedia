<script lang="ts">
  import { currentDirectory, pagesById, userSettings } from "../stores";
  import { Directory, Page } from "../lib/eb";
  import PageViewer from "../components/PageViewer.svelte";

  export let params: { uid: string } = { uid: "" };

  var page: Page;
  var dir: Directory;

  async function loadPage() {
    page = null;
    if ($pagesById.has(params?.uid)) {
      dir = $pagesById.get(params.uid);
      if (!dir.populated) {
        await dir.populate();
      }
      page = dir.pages.get(params.uid);
      if (dir != $currentDirectory) {
        currentDirectory.set(dir);
      }

      userSettings.update((us) => {
        if (!us.latestPageViewsByDirectory[dir.collection.uid]) {
          us.latestPageViewsByDirectory[dir.collection.uid] = [];
        }
        let existingIndex = us.latestPageViewsByDirectory[
          dir.collection.uid
        ].findIndex((it) => it === page.item.uid);
        if (existingIndex !== -1) {
          us.latestPageViewsByDirectory[dir.collection.uid].splice(
            existingIndex,
            1
          );
        }
        let newLength = us.latestPageViewsByDirectory[dir.collection.uid].push(
          page.item.uid
        );
        if (newLength > 100) {
          us.latestPageViewsByDirectory[dir.collection.uid].shift();
        }
        return us;
      });
    }
  }

  $: params.uid, loadPage();
</script>

<svelte:head>
  <title>{page ? page.meta.name : "Etepedia"}</title>
</svelte:head>

<PageViewer {page} />
