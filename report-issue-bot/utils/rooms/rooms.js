const rooms = [
  {
    nameBegins: 'I', // I Building Meeting Support
    roomId: 'Y2lzY29zcGFyazovL3VzL1JPT00vZWUzMjYxMjAtNmY4NC0xMWVmLThiMDItNDllZWRmOTc3OWQ0'
  },
  {
    nameBegins: 'C', // C Building Meeting Support
    roomId: 'Y2lzY29zcGFyazovL3VzL1JPT00vZWUzMjYxMjAtNmY4NC0xMWVmLThiMDItNDllZWRmOTc3OWQ0'
  }
];


function getRoomId(workspaceName){
    const room = rooms.find(room => workspaceName.startsWith(room.nameBegins))
    return room?.roomId
}


export default getRoomId;