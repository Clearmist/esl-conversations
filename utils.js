import { uniqueNamesGenerator, adjectives, animals, NumberDictionary } from 'unique-names-generator';

/*
Get the actual size of a resource downloaded by the browser (e.g. an image) in bytes.
This is supported in recent versions of all major browsers, with some caveats.
See https://developer.mozilla.org/en-US/docs/Web/API/PerformanceResourceTiming/encodedBodySize
*/
export function getResourceSize(url) {
    const entry = window?.performance?.getEntriesByName(url)?.[0];
    if (entry) {
        const size = entry?.encodedBodySize;
        return size || undefined;
    } else {
        return undefined;
    }
}

// Note: this only works on the server side
export function getNetlifyContext() {
    return process.env.CONTEXT;
}

export function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

const uniqueNamesConfig = {
    dictionaries: [adjectives, animals],
    separator: '-',
    length: 2
};

export function uniqueName() {
    return uniqueNamesGenerator(uniqueNamesConfig) + "-" + randomInt(100, 999);
}

export const uploadDisabled = process.env.NEXT_PUBLIC_DISABLE_UPLOADS?.toLowerCase() === "true";

export function findEntryByStub(data, stub) {
  for (const obj of data) {
    const entry = obj.entries.find(e => e.stub === stub);

    if (entry) {
      return entry;
    }
  }

  return null;
}

export function shuffleArray(arr) {
  const copy = arr.slice();

  for (let i = copy.length - 1; i > 0; i--) {
    // Get a random index.
    const j = Math.floor(Math.random() * (i + 1));

    // Swap things around.
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

export function toggleString(arr, str) {
  const index = arr.indexOf(str);

  if (index !== -1) {
    arr.splice(index, 1);
  } else {
    arr.push(str);
  }

  return arr;
}
