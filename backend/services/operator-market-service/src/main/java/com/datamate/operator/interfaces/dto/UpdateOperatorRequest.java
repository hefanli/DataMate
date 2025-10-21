package com.datamate.operator.interfaces.dto;


import lombok.Getter;
import lombok.Setter;

import java.util.List;

/**
 * UpdateOperatorRequest
 */

@Getter
@Setter
public class UpdateOperatorRequest {
  private String name;

  private String description;

  private String version;

  private String inputs;

  private String outputs;

  private List<Integer> categories;

  private String runtime;

  private String settings;
}

