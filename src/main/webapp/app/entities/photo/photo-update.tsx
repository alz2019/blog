import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Row, Col, FormText } from 'reactstrap';
import { isNumber, ValidatedField, ValidatedForm, ValidatedBlobField } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { IAlbum } from 'app/shared/model/album.model';
import { getEntities as getAlbums } from 'app/entities/album/album.reducer';
import { ITag } from 'app/shared/model/tag.model';
import { getEntities as getTags } from 'app/entities/tag/tag.reducer';
import { IPhoto } from 'app/shared/model/photo.model';
import { getEntity, updateEntity, createEntity, reset } from './photo.reducer';

export const PhotoUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const albums = useAppSelector(state => state.album.entities);
  const tags = useAppSelector(state => state.tag.entities);
  const photoEntity = useAppSelector(state => state.photo.entity);
  const loading = useAppSelector(state => state.photo.loading);
  const updating = useAppSelector(state => state.photo.updating);
  const updateSuccess = useAppSelector(state => state.photo.updateSuccess);

  const handleClose = () => {
    navigate('/photo');
  };

  useEffect(() => {
    if (!isNew) {
      dispatch(getEntity(id));
    }

    dispatch(getAlbums({}));
    dispatch(getTags({}));
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  const saveEntity = values => {
    values.taken = convertDateTimeToServer(values.taken);
    values.uploaded = convertDateTimeToServer(values.uploaded);

    const entity = {
      ...photoEntity,
      ...values,
      tags: mapIdList(values.tags),
      album: albums.find(it => it.id.toString() === values.album.toString()),
    };

    if (isNew) {
      dispatch(createEntity(entity));
    } else {
      dispatch(updateEntity(entity));
    }
  };

  const defaultValues = () =>
    isNew
      ? {
          taken: displayDefaultDateTime(),
          uploaded: displayDefaultDateTime(),
        }
      : {
          ...photoEntity,
          taken: convertDateTimeFromServer(photoEntity.taken),
          uploaded: convertDateTimeFromServer(photoEntity.uploaded),
          album: photoEntity?.album?.id,
          tags: photoEntity?.tags?.map(e => e.id.toString()),
        };

  const metadata = (
    <div>
      <ValidatedField label="Height" id="photo-height" name="height" data-cy="height" type="text" />
      <ValidatedField label="Width" id="photo-width" name="width" data-cy="width" type="text" />
      <ValidatedField label="Taken" id="photo-taken" name="taken" data-cy="taken" type="datetime-local" placeholder="YYYY-MM-DD HH:mm" />
      <ValidatedField
        label="Uploaded"
        id="photo-uploaded"
        name="uploaded"
        data-cy="uploaded"
        type="datetime-local"
        placeholder="YYYY-MM-DD HH:mm"
      />
    </div>
  );

  const metadataRows = isNew ? '' : metadata;

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="blogApp.photo.home.createOrEditLabel" data-cy="PhotoCreateUpdateHeading">
            Create or edit a Photo
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ValidatedForm defaultValues={defaultValues()} onSubmit={saveEntity}>
              {!isNew ? <ValidatedField name="id" required readOnly id="photo-id" label="ID" validate={{ required: true }} /> : null}
              <ValidatedField
                label="Title"
                id="photo-title"
                name="title"
                data-cy="title"
                type="text"
                validate={{
                  required: { value: true, message: 'This field is required.' },
                }}
              />
              <ValidatedField label="Description" id="photo-description" name="description" data-cy="description" type="textarea" />
              <ValidatedBlobField
                label="Image"
                id="photo-image"
                name="image"
                data-cy="image"
                isImage
                accept="image/*"
                validate={{
                  required: { value: true, message: 'This field is required.' },
                }}
              />
              {metadataRows}
              <ValidatedField id="photo-album" name="album" data-cy="album" label="Album" type="select">
                <option value="" key="0" />
                {albums
                  ? albums.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.title}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <ValidatedField label="Tag" id="photo-tag" data-cy="tag" type="select" multiple name="tags">
                <option value="" key="0" />
                {tags
                  ? tags.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.name}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/photo" replace color="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">Back</span>
              </Button>
              &nbsp;
              <Button color="primary" id="save-entity" data-cy="entityCreateSaveButton" type="submit" disabled={updating}>
                <FontAwesomeIcon icon="save" />
                &nbsp; Save
              </Button>
            </ValidatedForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default PhotoUpdate;
