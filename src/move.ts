interface File {
  id: string;
  name: string;
}

interface Folder extends File {
  files: File[];
}

interface FileInformation {
  fileIndex: number;
  folder: Folder;
  file: File;
}

type List = Folder[];

function getFileInformationByID(list: List, fileID: string): FileInformation | undefined {
  for (let i in list) {
    const folder = list[i];
    const fileIndex = folder.files.findIndex((item: File) => item.id === fileID);

    if (fileIndex !== -1) {
      return {
        fileIndex,
        folder,
        file: folder.files[fileIndex],
      };
    }
  }

  return undefined;
}

function getFolderByID(list: List, folderID: string): Folder | undefined {
  return list.find((folder: Folder) => folder.id === folderID);
}

function deleteFileFromFolder(folder: Folder, fileIndexToDelete: number) {
  folder.files.splice(fileIndexToDelete, 1);
}

function addFileToFolder(folder: Folder, file: File) {
  folder.files.push(file);
}

function getAllFilesAsFlatten(list: List): List {
  return list.reduce((prev: List, next: any) => prev.concat(next.files), []);
}

export default function move(list: List, source: string, destination: string): List {
  const sourceFileInformation = getFileInformationByID(list, source);
  const destinationFolder = getFolderByID(list, destination);

  const allFilesAsFlatten = getAllFilesAsFlatten(list);

  if (list.find((folder: Folder) => folder.id === source)) {
    throw new Error('You cannot move a folder');
  } else if (allFilesAsFlatten.find((file: File) => file.id === destination)) {
    throw new Error('You cannot specify a file as the destination');
  } else if (sourceFileInformation && destinationFolder) {
    deleteFileFromFolder(sourceFileInformation.folder, sourceFileInformation.fileIndex);
    addFileToFolder(destinationFolder, sourceFileInformation.file);

    return list;
  } else {
    throw new Error('File or folder cannot be found');
  }
}
