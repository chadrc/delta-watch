import DeltaWatch from 'delta-watch';

window.addEventListener('load', () => {
  // Setup
  let downloadsData = DeltaWatch.Watchable({
    available: [],
    active: []
  });

  const {Accessor, Watcher, Mutator} = downloadsData;

  // There are 5 of each available and active downloads
  // Loop 1 to 5 and create watches for them
  for (let i=1; i<=5; i++) {
    // Watches for available downloads
    // Get elements
    let availableDownloadText = document.getElementById(`availableDownloadText${i}`);
    let availableDownloadSizeText = document.getElementById(`availableDownloadSizeText${i}`);
    let availableDownloadBtn = document.getElementById(`availableDownloadBtn${i}`);

    // Watch entire download object, since they don't change after being set the first time
    DeltaWatch.Watch(Watcher.available[i], (value: {name: string, size: number}) => {
      let nameText = "Unavailable";
      let sizeText = "&mdash;";
      if (value) {
        nameText = value.name;
        sizeText = `Size: ${value.size}`;
      }

      // Set text values if they have changed
      if (sizeText !== availableDownloadSizeText.innerHTML) {
        availableDownloadSizeText.innerHTML = sizeText;
      }

      if (nameText !== availableDownloadText.innerHTML) {
        availableDownloadText.innerHTML = nameText;
      }

      // Re-enable button if download exists
      if (!value) {
        availableDownloadBtn.removeAttribute('disabled');
      } else {
        // Else disable it
        availableDownloadBtn.setAttribute('disabled', '');
      }
    });

    // Watches for active downloads
    let activeDownloadText = document.getElementById(`activeDownloadText${i}`);
    let activeDownloadProgress = document.getElementById(`activeDownloadProgress${i}`);

    // Watch name and amountDownloaded individually since name doesn't change, but amountDownloaded will
    DeltaWatch.Watch(Watcher.active[i].name, (value: string) => {
      let newText = value || '&mdash;';
      if (newText !== activeDownloadText.innerHTML) {
        activeDownloadText.innerHTML = newText;
      }
    });

    DeltaWatch.Watch(Watcher.active[i].amountDownloaded, (value: number) => {
      let percent = value / Accessor.active[i].size;
      activeDownloadProgress.style.width = `${percent}%`;
    });

    // Also need to set up a Mutation based on clicking available download button
    availableDownloadBtn.addEventListener('click', () => {
      // Take download from available and put it into active
      let download = Accessor.available[i];
      Mutator.active.push(download);
      Mutator.available.splice(i, 1);
    });
  }
});