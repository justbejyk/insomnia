import React, { type FC, useEffect, useRef } from 'react';
import { OverlayContainer } from 'react-aria';
import { useFetcher, useNavigation, useParams } from 'react-router-dom';

import { getWorkspaceLabel } from '../../../common/get-workspace-label';
import { strings } from '../../../common/strings';
import type { Project } from '../../../models/project';
import type { Workspace } from '../../../models/workspace';
import { Modal, type ModalHandle, type ModalProps } from '../base/modal';
import { ModalBody } from '../base/modal-body';
import { ModalFooter } from '../base/modal-footer';
import { ModalHeader } from '../base/modal-header';
import { Icon } from '../icon';

interface WorkspaceDuplicateModalProps extends ModalProps {
  workspace: Workspace;
  projects: Project[];
}

export const WorkspaceDuplicateModal: FC<WorkspaceDuplicateModalProps> = ({ workspace, projects, onHide }) => {
  const { organizationId } = useParams<{organizationId: string}>();
  const { Form } = useFetcher();
  const modalRef = useRef<ModalHandle>(null);
  const navigation = useNavigation();
  useEffect(() => {
    modalRef.current?.show();
  }, []);

  return (
    <OverlayContainer onClick={e => e.stopPropagation()}>
      <Modal onHide={onHide} ref={modalRef}>
        <ModalHeader>{`Duplicate ${workspace && getWorkspaceLabel(workspace).singular}`}</ModalHeader>
        <ModalBody className="wide">
          <Form
            action={`/organization/${organizationId}/project/${workspace.parentId}/workspace/${workspace._id}/duplicate`}
            method='post'
            id="workspace-duplicate-form"
            className="wide pad"
          >
            <div className="form-control form-control--wide form-control--outlined">
              <label>
                New Name
                <input name="name" defaultValue={workspace.name} />
              </label>
            </div>
            <input name="workspaceId" value={workspace._id} readOnly className="hidden" />
            <div className="form-control form-control--outlined">
              <label>
                {strings.project.singular} to duplicate into
                <select defaultValue={workspace.parentId} name="projectId">
                  {projects.map(project => (
                    <option key={project._id} value={project._id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </Form>
        </ModalBody>
        <ModalFooter>
          <button type="submit" disabled={navigation.state !== 'idle'} form="workspace-duplicate-form" className="btn">
            {navigation.state !== 'idle' && <Icon icon='spinner' className='animate-spin' />} Duplicate
          </button>
        </ModalFooter>
      </Modal>
    </OverlayContainer>
  );
};
