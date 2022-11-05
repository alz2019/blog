import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { byteSize, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './album.reducer';

export const AlbumDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const albumEntity = useAppSelector(state => state.album.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="albumDetailsHeading">Album</h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">ID</span>
          </dt>
          <dd>{albumEntity.id}</dd>
          <dt>
            <span id="title">Title</span>
          </dt>
          <dd>{albumEntity.title}</dd>
          <dt>
            <span id="description">Description</span>
          </dt>
          <dd>{albumEntity.description}</dd>
          <dt>
            <span id="created">Created</span>
          </dt>
          <dd>{albumEntity.created ? <TextFormat value={albumEntity.created} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>User</dt>
          <dd>{albumEntity.user ? albumEntity.user.login : ''}</dd>
        </dl>
        <Button tag={Link} to="/album" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/album/${albumEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

export default AlbumDetail;
