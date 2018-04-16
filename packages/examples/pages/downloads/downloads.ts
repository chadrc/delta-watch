import DeltaWatch from 'delta-watch';

const possibleDownloadNames: string[] = [
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

const activeLinkBtnClass = ["orange-text", "text-accent-2"];
const inactiveLinkBtnClass = ["grey-text"];

// Small utility to set classes on a button
function resolveBtnActiveClass(btn: HTMLElement, active: boolean) {
  if (active) {
    btn.classList.remove(...inactiveLinkBtnClass);
    btn.classList.add(...activeLinkBtnClass);
  } else {
    btn.classList.add(...inactiveLinkBtnClass);
    btn.classList.remove(...activeLinkBtnClass);
  }
}

let availableDownloadNames = possibleDownloadNames.slice();

function getRandomName() {
  if (availableDownloadNames.length === 0) {
    availableDownloadNames = possibleDownloadNames.slice();
  }
  let roll = Math.floor(Math.random() * availableDownloadNames.length);
  return availableDownloadNames.splice(roll, 1)[0];
}

function getRandomSize() {
  return Math.floor(Math.random() * 100001 + 1000);
}

function getRandomDownloadAmount(total: number) {
  let max = Math.floor(total * .01);
  return Math.floor(Math.random() * max + 100);
}

function makeRandomDownload() {
  return {
    name: getRandomName(),
    size: getRandomSize(),
    amountDownloaded: 0,
    completed: false
  };
}

window.addEventListener('load', () => {
  // Setup
  let downloadsData = DeltaWatch.Watchable({
    available: [],
    active: [],
    downloadsCompleted: 0
  });

  const {Accessor, Watcher, Mutator} = downloadsData;

  // Common mutation logic
  // Used when clicking a download button for one download or the download all button
  function moveAvailableToActive(index: number) {
    // Take download from available and put it into active
    let download = Accessor.available[index];
    Mutator.available[index] = null; // Null instead of splice so available downloads don't move in ui

    // If active length is 5, that means its full of in progress or completed downloads
    // Need to first completed and replace it
    if (Accessor.active.length === 5) {
      // New download only becomes available only when one is completed
      // So completedIndex should never be -1
      // Also check for null in case of clear button being pressed
      let completedIndex = Accessor.active.findIndex((download: any) => download === null || download.completed === true);
      Mutator.active[completedIndex] = download;
    } else {
      // Else just need to push download
      Mutator.active.push(download);
    }
  }

  // Singular components
  let downloadsCompleteText = document.getElementById(`downloadsCompleteText`);
  let clearCompletedBtn = document.getElementById('clearCompletedBtn');
  let downloadAllBtn = document.getElementById('downloadAllBtn');

  // Download complete text Watcher
  DeltaWatch.Watch(Watcher.downloadsCompleted, (value: number) => {
    downloadsCompleteText.innerHTML = `Downloads Completed: ${value}`;
  });

  // Watcher on entire available array to determine if 'Download All' button should be active
  DeltaWatch.Watch(Watcher.available, (value: any[]) => {
    // button active if any slot is non-null
    let count = Accessor.available.reduce((result: number, item: any) => item === null ? result : result + 1, 0);
    resolveBtnActiveClass(downloadAllBtn, count > 0);
  });

  // Watcher on entire active array to determine if 'Clear Completed' button should be active
  DeltaWatch.Watch(Watcher.active, (value: any[]) => {
    // button active if any in active list are completed
    let count = Accessor.active.reduce((result: number, item: any) => {
      if (item === null) {
        return result;
      }

      return item.completed ? result + 1 : result;
    }, 0);

    resolveBtnActiveClass(clearCompletedBtn, count > 0);
  });

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
    let activeDownloadCompletedIcon = document.getElementById(`activeDownloadCompletedIcon${i}`);

    // Watch name and amountDownloaded individually since name doesn't change, but amountDownloaded will
    DeltaWatch.Watch(Watcher.active[index].name, (value: string) => {
      let newText = value || '&mdash;';
      if (newText !== activeDownloadText.innerHTML) {
        activeDownloadText.innerHTML = newText;
      }
    });

    DeltaWatch.Watch(Watcher.active[index].amountDownloaded, () => {
      let percent = 100;
      if (Accessor.active[index] !== null) {
        percent = Math.floor((Accessor.active[index].amountDownloaded / Accessor.active[index].size) * 100);
      }
      activeDownloadProgress.style.width = `${percent}%`;
    });

    DeltaWatch.Watch(Watcher.active[index].completed, (value: boolean) => {
      if (value) {
        activeDownloadCompletedIcon.classList.remove('hide');
      } else {
        activeDownloadCompletedIcon.classList.add('hide');
      }
    });

    // Also need to set up a Mutation based on clicking available download button
    availableDownloadBtn.addEventListener('click', () => {
      moveAvailableToActive(index);
    });
  }

  // Download all available button action
  downloadAllBtn.addEventListener('click', () => {
    for (let i=0; i<Accessor.available.length; i++) {
      if (Accessor.available[i] !== null) {
        moveAvailableToActive(i);
      }
    }
  });

  // Clear completed button action
  clearCompletedBtn.addEventListener('click', () => {
    for (let i=0; i<Accessor.active.length; i++) {
      // Skip already cleared downloads
      if (Accessor.active[i] !== null && Accessor.active[i].completed) {
        // Null out so downloads stay in same position
        Mutator.active[i] = null;
      }
    }
  });

  // Initialize available array and start event for mocking data downloads
  for (let i=0; i<5; i++) {
    Mutator.available.push(makeRandomDownload());
  }

  setInterval(() => {
    for (let i=0; i<Accessor.active.length; i++) {
      // Active download slots get nulled out when clear button is pressed
      // Skipp these slots
      if (Accessor.active[i] !== null && !Accessor.active[i].completed) {
        let amountDownloaded = Accessor.active[i].amountDownloaded;
        let size = Accessor.active[i].size;
        let newAmount = amountDownloaded + getRandomDownloadAmount(size);
        Mutator.active[i].amountDownloaded = newAmount;
        if (newAmount >= size) {
          Mutator.active[i].completed = true;
          Mutator.downloadsCompleted = Accessor.downloadsCompleted + 1;
          // ++ only works the first time TODO: figure out if ++ operator works normally with Proxies, same issue with +=
          // Mutator.downloadsCompleted++;

          // Since we null out available download slots pushing won't work
          // We need to find the first null slot to insert a new download
          // If a download completed then we have at least one nulled slot, so nullIndex should never equal -1
          let nullIndex = Accessor.available.findIndex((download: any) => download === null);
          Mutator.available[nullIndex] = makeRandomDownload();
        }
      }
    }
  }, 100);
});