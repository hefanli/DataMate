package com.datamate.operator.interfaces.dto;


import lombok.Getter;
import lombok.Setter;

import java.util.List;

/**
 * CreateOperatorRequest
 */

@Getter
@Setter
public class CreateOperatorRequest {
  private String id;

  private String name;

  private String description;

  private String version;

  private String inputs;

  private String outputs;

  private List<Integer> categories;

  private String runtime;

  private String settings;

  private String fileName;
}

