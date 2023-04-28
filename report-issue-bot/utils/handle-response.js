/**
 *
 * @param {Response} r
 * @returns
 */
function handleResponse(r) {
  return r.ok ? Promise.resolve(r) : Promise.reject(r);
}

export default handleResponse;
