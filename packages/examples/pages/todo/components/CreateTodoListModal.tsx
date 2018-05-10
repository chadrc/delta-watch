import * as React from 'react';
import {ChangeEvent, Ref} from "react";
import {WatchStore} from "../store";
import {closeNewTodoListModal, createNewTodoList, updateNewTodoListName} from "../actions";
declare const M: any; // Materialize CSS global

interface CreateTodoListModalProps {
  open: boolean
  newTodoListName: string
}

class CreateTodoListModal extends React.Component<CreateTodoListModalProps> {
  private readonly _modalRef: any;
  private _modalInstance: any;

  constructor(props: CreateTodoListModalProps) {
    super(props);
    this._modalRef = React.createRef();
    this._modalInstance = null;
  }

  render() {
    return (
      <div id="termsModal" className="modal" ref={this._modalRef}>
        <div className="modal-content">
          <h4>Create Todo List</h4>
          <form className="col s12">
            <div className="input-field col s12">
              <input type="text"
                     placeholder="New Todo List"
                     value={this.props.newTodoListName}
                     onChange={(event: ChangeEvent<HTMLInputElement>) => updateNewTodoListName(event.target.value)}/>
              <label htmlFor="address"/>
            </div>
            <button id="submitBtn"
                    className="btn waves-effect waves-light right"
                    disabled={this.props.newTodoListName.trim() === ''}
                    type="submit"
                    name="action"
                    onClick={(event) => {
                      event.stopPropagation();
                      event.preventDefault();

                      createNewTodoList();
                    }}>
              Create
            </button>
          </form>
        </div>
      </div>
    );
  }

  componentDidUpdate(prevProps: CreateTodoListModalProps) {
    if (this._modalInstance && this.props.open !== prevProps.open) {
      if (this.props.open) {
        this._modalInstance.open();
      } else {
        this._modalInstance.close();
      }
    }
  }

  componentDidMount() {
    this._modalInstance = M.Modal.init(this._modalRef.current, {
      onCloseEnd: () => {
        closeNewTodoListModal();
      }
    });
  }
}

const WatcherCreateTodoListModal = WatchStore(
  (watcher: any) => ({
    open: watcher.creatingTodoList,
    newTodoListName: watcher.newTodoListName
  })
)(CreateTodoListModal);

export default WatcherCreateTodoListModal;