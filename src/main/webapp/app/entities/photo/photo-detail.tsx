import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { openFile, byteSize, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './photo.reducer';

export const PhotoDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const photoEntity = useAppSelector(state => state.photo.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="photoDetailsHeading">Photo</h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">ID</span>
          </dt>
          <dd>{photoEntity.id}</dd>
          <dt>
            <span id="title">Title</span>
          </dt>
          <dd>{photoEntity.title}</dd>
          <dt>
            <span id="description">Description</span>
          </dt>
          <dd>{photoEntity.description}</dd>
          <dt>
            <span id="image">Image</span>
          </dt>
          <dd>
            {photoEntity.image ? (
              <div>
                {photoEntity.imageContentType ? (
                  <a onClick={openFile(photoEntity.imageContentType, photoEntity.image)}>
                    <img src={`data:${photoEntity.imageContentType};base64,${photoEntity.image}`} style={{ maxHeight: '30px' }} />
                  </a>
                ) : null}
                <span>
                  {photoEntity.imageContentType}, {byteSize(photoEntity.image)}
                </span>
              </div>
            ) : null}
          </dd>
          <dt>
            <span id="height">Height</span>
          </dt>
          <dd>{photoEntity.height}</dd>
          <dt>
            <span id="width">Width</span>
          </dt>
          <dd>{photoEntity.width}</dd>
          <dt>
            <span id="taken">Taken</span>
          </dt>
          <dd>{photoEntity.taken ? <TextFormat value={photoEntity.taken} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="uploaded">Uploaded</span>
          </dt>
          <dd>{photoEntity.uploaded ? <TextFormat value={photoEntity.uploaded} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>Album</dt>
          <dd>{photoEntity.album ? photoEntity.album.title : ''}</dd>
          <dt>Tag</dt>
          <dd>
            {photoEntity.tags
              ? photoEntity.tags.map((val, i) => (
                  <span key={val.id}>
                    <a>{val.name}</a>
                    {photoEntity.tags && i === photoEntity.tags.length - 1 ? '' : ', '}
                  </span>
                ))
              : null}
          </dd>
        </dl>
        <Button tag={Link} to="/photo" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/photo/${photoEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

export default PhotoDetail;
