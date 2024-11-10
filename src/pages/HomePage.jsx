// src/pages/HomePage.jsx
import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import MapEditor from "../components/MapEditor";
import ControlForm from "../components/ControlForm";
import BlockManager from "../components/BlockManager";
import ActionButtons from "../components/ActionButtons";
import { useBlockContext } from "../context/BlockContext";

const HomePage = () => {
  const { blocks } = useBlockContext();

  return (
    <Container fluid className="mt-4">
      <h2 className="text-center mb-4">Farming Map Editor</h2>
      {/* Map Editor */}
      <Row>
        <Col>
          <MapEditor />
        </Col>
      </Row>

      {/* Control Form and Block Manager */}
      <Row className="mt-4">
        <Col md={4}>
          <ControlForm />
          <ActionButtons />
        </Col>
        <Col md={8}>
          <BlockManager />
        </Col>
      </Row>

      {/* Footer with Block Count */}
      <Row className="mt-3">
        <Col className="d-flex justify-content-center">
          <span>
            <strong>Total Blocks:</strong> {blocks.length}
          </span>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
