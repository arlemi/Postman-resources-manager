// define elements
const button_get = document.querySelector('button#get')
const button_delete = document.querySelector('button#delete')
const button_cancel_edit = document.getElementById('cancel_edit');
const button_confirm_edit = document.getElementById('confirm_edit');
const api_key = document.querySelector('input') 
const sections = document.getElementsByTagName('section');
const workspaces = document.getElementById('workspaces')
const workspace = document.getElementById('workspace')
const requests = document.getElementById('requests')
const delete_button_wrapper = document.getElementsByClassName('button-wrapper')[0];
const edit_confirmation_wrapper = document.getElementsByClassName('edit-mode-buttons-wrapper')[0];

// define event listeners
button_get.addEventListener('click', () => fetchWorkspaces())

// functions
const createElement = function(el_class, el_name, el_id) {
  let element = document.createElement('li')
  let input = document.createElement('input')
  input.type = "checkbox"
  input.name = el_class
  input.value = el_id
  input.id = el_id
  input.checked = false
  element.appendChild(input)
  let label = document.createElement('label')
  label.htmlFor = el_id  
  label.textContent= el_name + " (" + el_id + ")"
  if(el_class == "workspace") {
    label.addEventListener('click', (e) => fetchWorkspace(el_id, e))
    input.addEventListener('click', (e) => fetchWorkspace(el_id, e))
  }
  else if(el_class == "collection") {
    label.addEventListener('click', (e) => fetchCollection(el_id, e))
    input.addEventListener('click', (e) => fetchCollection(el_id, e))
  }
  label.className = el_class
  element.appendChild(label)
  return element
}

const fetchWorkspaces = async function(id, e) 
{
    let headers = new Headers()
    headers.append('api_key', api_key.value)
    
    let requestOptions = {
      method: 'GET',
      headers: headers,
      redirect: 'follow'
    }

    workspaces.innerHTML = ''
    await fetch('/workspaces', requestOptions)
    .then(async (response) => { return await response.json() })
    .then(result => result.workspaces.forEach( el => {
        workspaces.appendChild(createElement("workspace", el.name, el.id))
    }))
    .catch(error => console.log('error', error))
}

const fetchWorkspace = async function(id, e) 
{
    let headers = new Headers()
    headers.append('api_key', api_key.value)
    headers.append('workspace_id', id)
    
    let requestOptions = {
      method: 'GET',
      headers: headers,
      redirect: 'follow'
    }

    workspace.innerHTML = ''
    await fetch('/workspace', requestOptions)
    .then(async (response) => { return await response.json() })
    .then(result => result.workspace.collections.forEach( el => {
        workspace.appendChild(createElement("collection", el.name, el.uid))
    }))
    .catch(error => console.log('error', error))
}

const fetchCollection = async function(id, e) 
{
    let headers = new Headers()
    headers.append('api_key', api_key.value)
    headers.append('collection_uid', id)
    
    let requestOptions = {
      method: 'GET',
      headers: headers,
      redirect: 'follow'
    }

    requests.innerHTML = ''
    await fetch('/collection', requestOptions)
    .then(async (response) => { return await response.json() })
    .then(result => { 
        reqArray = []
        function func(item) {
          if (item.hasOwnProperty('request')) {
            reqArray.push(item)
          }
          if (!item.hasOwnProperty('item')) {
            return
          }
          item.item.forEach(child => func(child))
        }
        func(result.collection)
        reqArray.forEach(el => {
          requests.appendChild(createElement("request", el.name, el._postman_id))
        })
    })
    .catch(error => console.log('error', error))
}