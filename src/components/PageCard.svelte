<script lang="ts">
  import { Page } from "../lib/eb";

  export let page: Page;
</script>

<div>
  <h3>
    {page.meta.name}
  </h3>
  <p><em>{page.meta.description}</em></p>
</div>
