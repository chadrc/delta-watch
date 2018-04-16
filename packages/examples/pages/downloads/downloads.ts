import DeltaWatch from 'delta-watch';

const possibleDownloadNames = [
  'Red',
  'Blue',
  'Green',
  'Yellow',
  'Orange',
  'Purple',
  'Magenta',
  'Cyan',
  'White',
  'Black',
  'Grey'
];

function getRandomName() {
  let roll = Math.floor(Math.random() * possibleDownloadNames.length);
  return possibleDownloadNames[roll];
}

function getRandomSize() {
  return Math.floor(Math.random() * 100001 + 1000);
}

function getRandomDownloadAmount(total: number) {
  let max = Math.floor(total * .01);
  return Math.floor(Math.random() * max + 100);
}

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
    let index = i - 1; // i corresponds to dom ids which start at 1, so this will be the array index

    // Get elements
    let availableDownloadText = document.getElementById(`availableDownloadText${i}`);
    let availableDownloadSizeText = document.getElementById(`availableDownloadSizeText${i}`);
    let availableDownloadBtn = document.getElementById(`availableDownloadBtn${i}`);

    // Watch entire download object, since they don't change after being set the first time
    DeltaWatch.Watch(Watcher.available[index], (value: {name: string, size: number}) => {
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
      if (value) {
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
    DeltaWatch.Watch(Watcher.active[index].name, (value: string) => {
      let newText = value || '&mdash;';
      if (newText !== activeDownloadText.innerHTML) {
        activeDownloadText.innerHTML = newText;
      }
    });

    DeltaWatch.Watch(Watcher.active[index].amountDownloaded, (value: number) => {
      let percent = Math.floor((Accessor.active[index].amountDownloaded / Accessor.active[index].size) * 100);
      activeDownloadProgress.style.width = `${percent}%`;
    });

    // Also need to set up a Mutation based on clicking available download button
    availableDownloadBtn.addEventListener('click', () => {
      // Take download from available and put it into active
      let download = Mutator.available.splice(index, 1)[0];
      Mutator.active.push(download);
    });
  }

  // Initialize available array and start event for mocking data downloads
  for (let i=0; i<5; i++) {
    let download = {
      name: getRandomName(),
      size: getRandomSize(),
      amountDownloaded: 0,
    };
    Mutator.available.push(download);
  }

  setInterval(() => {
    for (let i=0; i<Accessor.active.length; i++) {
      let amountDownloaded = Accessor.active[i].amountDownloaded;
      let size = Accessor.active[i].size;
      if (amountDownloaded < size) {
        Mutator.active[i].amountDownloaded = amountDownloaded + getRandomDownloadAmount(size);
      }
    }
  }, 100);
});